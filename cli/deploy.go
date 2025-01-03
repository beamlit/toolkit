package cli

import (
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"slices"
	"strings"

	"github.com/beamlit/toolkit/sdk"
	"github.com/spf13/cobra"
)

func executePythonGenerateBeamlitDeployment(tempDir string) error {
	pythonCode := fmt.Sprintf(`
from beamlit.deploy import generate_beamlit_deployment
generate_beamlit_deployment("%s")
	`, tempDir)
	cmd := exec.Command("python", "-c", pythonCode)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func dockerLogin(registryURL string, apiUrl string) error {
	credentials := sdk.LoadCredentials(workspace)

	var password string
	if credentials.APIKey != "" {
		password = credentials.APIKey
	} else if credentials.AccessToken != "" {
		provider := sdk.NewBearerTokenProvider(credentials, workspace, apiUrl)
		provider.RefreshIfNeeded()
		password = provider.GetCredentials().AccessToken
	} else {
		return fmt.Errorf("no credentials found")
	}
	cmd := exec.Command(
		"docker",
		"login",
		"-u", "beamlit",
		"--password-stdin",
		registryURL,
	)

	stdin, err := cmd.StdinPipe()
	if err != nil {
		return err
	}

	cmd.Stdout = nil
	cmd.Stderr = nil

	if err := cmd.Start(); err != nil {
		fmt.Printf("Could not login to beamlit registry: %v", err)
		return err
	}

	_, err = stdin.Write([]byte(password))
	if err != nil {
		return err
	}

	stdin.Close()

	return cmd.Wait()
}

func buildBeamlitDeployment(dockerfile string, destination string) error {
	fmt.Printf("Building beamlit deployment from %s to %s\n", dockerfile, destination)
	cmd := exec.Command(
		"docker",
		"build",
		"-t",
		destination,
		"--push",
		"--platform",
		"linux/amd64",
		"-f",
		dockerfile,
		".",
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	// Create a channel to catch interrupt signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt)

	// Create a channel to receive command completion status
	done := make(chan error)

	// Run the command in a goroutine
	go func() {
		done <- cmd.Run()
	}()

	// Wait for either command completion or interrupt
	select {
	case err := <-done:
		if err != nil {
			fmt.Printf("Error building beamlit deployment: %v\n", err)
			return err
		}
		fmt.Printf("Beamlit deployment from %s built successfully\n", dockerfile)
		return nil
	}
}

func (r *Operations) handleDeploymentFile(tempDir string, agents *[]string, path string, info os.FileInfo, err error) error {
	if err != nil {
		return err
	}

	// Skip directories
	if info.IsDir() {
		return nil
	}

	isAgent := strings.Contains(path, "agents/")
	isFunction := strings.Contains(path, "functions/")
	resourceType := "agent"
	if isFunction {
		resourceType = "function"
	}
	// Get relative path from tempDir
	relPath, err := filepath.Rel(tempDir, path)
	if err != nil {
		return fmt.Errorf("failed to get relative path: %w", err)
	}
	name := strings.Split(relPath, "/")[1]
	if isAgent {
		if !slices.Contains(*agents, name) {
			*agents = append(*agents, name)
		}
	}

	// Check if file is a Dockerfile
	if filepath.Base(path) == "Dockerfile" {
		// Build the Docker image
		destination := fmt.Sprintf("%s/%s/%ss/%s", r.GetRegistryURL(), workspace, resourceType, name)
		fmt.Printf("Building Docker image for %s at %s\n", name, destination)
		err = buildBeamlitDeployment(path, destination)
		if err != nil {
			return fmt.Errorf("failed to build Docker image: %w", err)
		}
	}
	if filepath.Ext(path) == ".yaml" || filepath.Ext(path) == ".yml" {
		fmt.Printf("Applying configuration for %s:%s -> file: %s\n", resourceType, name, filepath.Base(path))
		err = r.Apply(path, false)
		if err != nil {
			return fmt.Errorf("failed to apply configuration: %w", err)
		}
	}
	return nil
}

func (r *Operations) DeployAgentAppCmd() *cobra.Command {

	cmd := &cobra.Command{
		Use:     "deploy",
		Args:    cobra.ExactArgs(0),
		Aliases: []string{"d", "dp"},
		Short:   "Deploy a beamlit agent app",
		Long:    "Deploy a beamlit agent app, you must be in a beamlit agent app directory.",
		Example: `bl deploy`,
		Run: func(cmd *cobra.Command, args []string) {

			// Create a temporary directory for deployment files
			tempDir := "deploy-tmp-dir"

			err := dockerLogin(r.GetRegistryURL(), r.BaseURL)
			if err != nil {
				fmt.Printf("Could not login to beamlit registry: %v\n", err)
				os.Exit(1)
			}

			// Execute Python script using the Python interpreter
			err = executePythonGenerateBeamlitDeployment(tempDir)
			if err != nil {
				fmt.Printf("Error executing Python script: %v\n", err)
				os.Exit(1)
			}

			agents := []string{}

			// Walk through the temporary directory recursively
			err = filepath.Walk(tempDir, func(path string, info os.FileInfo, err error) error {
				if err != nil {
					return err
				}
				return r.handleDeploymentFile(tempDir, &agents, path, info, err)
			})
			if err != nil {
				fmt.Printf("Error deploying beamlit app: %v\n", err)
				os.Exit(1)
			}

			env := "production"
			if environment != "" {
				env = environment
			}
			fmt.Printf("Your beamlit agents are ready:\n")
			for _, agent := range agents {
				fmt.Printf(
					"- %s at %s/%s/global-inference-network/agent/%s?environment=%s\n",
					agent,
					r.AppURL,
					workspace,
					agent,
					env,
				)
			}
			// Clean up temporary directory
			err = os.RemoveAll(tempDir)
			if err != nil {
				fmt.Printf("Error cleaning up temporary directory: %v\n", err)
				os.Exit(1)
			}
		},
	}
	return cmd
}
