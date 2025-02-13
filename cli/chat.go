package cli

import (
	"context"
	"fmt"
	"os"

	"encoding/json"
	"io"
	"net/http"

	"github.com/beamlit/toolkit/cli/chat"
	"github.com/spf13/cobra"

	tea "github.com/charmbracelet/bubbletea"
)

func (r *Operations) ChatCmd() *cobra.Command {
	var debug bool
	var local bool

	cmd := &cobra.Command{
		Use:     "chat [agent-name]",
		Args:    cobra.ExactArgs(1),
		Short:   "Chat with an agent",
		Example: `bl chat my-agent`,
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Chatting with", args[0])
			if len(args) == 0 {
				fmt.Println("Error: Agent name is required")
				os.Exit(1)
			}

			resourceType := "agent"
			resourceName := args[0]

			err := r.Chat(context.Background(), workspace, resourceType, resourceName, debug, local)
			if err != nil {
				fmt.Println("Error: Failed to chat", err)
				os.Exit(1)
			}
		},
	}

	cmd.Flags().BoolVar(&debug, "debug", false, "Debug mode")
	cmd.Flags().BoolVar(&local, "local", false, "Run locally")
	return cmd
}

func (r *Operations) Chat(
	ctx context.Context,
	workspace string,
	resourceType string,
	resourceName string,
	debug bool,
	local bool,
) error {
	if !local {
		err := r.CheckResource(ctx, workspace, resourceType, resourceName)
		if err != nil {
			return err
		}
	}

	return r.BootChat(ctx, workspace, resourceType, resourceName, debug, local)
}

func (r *Operations) BootChat(
	ctx context.Context,
	workspace string,
	resourceType string,
	resourceName string,
	debug bool,
	local bool,
) error {
	m := &chat.ChatModel{
		Messages:    []chat.Message{},
		Workspace:   workspace,
		ResType:     resourceType,
		ResName:     resourceName,
		SendMessage: r.SendMessage,
		Debug:       debug,
		Local:       local,
	}

	p := tea.NewProgram(
		m,
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	)
	if _, err := p.Run(); err != nil {
		return err
	}

	return nil
}

func (r *Operations) CheckResource(
	ctx context.Context,
	workspace string,
	resourceType string,
	resourceName string,
) error {
	// Verify only for agent type
	if resourceType != "agent" {
		return nil
	}

	// Call GetAgent with the required parameters
	resp, err := client.GetAgent(ctx, resourceName)
	if err != nil {
		return fmt.Errorf("failed to get agent: %w", err)
	}
	defer resp.Body.Close()

	// Check response status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("agent %s not found", resourceName)
	}

	return nil
}

func (r *Operations) SendMessage(
	ctx context.Context,
	workspace string,
	resourceType string,
	resourceName string,
	message string,
	debug bool,
	local bool,
) (string, error) {
	type Input struct {
		Inputs string `json:"inputs"`
	}
	inputBody, err := json.Marshal(Input{Inputs: message})
	if err != nil {
		return "", fmt.Errorf("failed to marshal message: %w", err)
	}
	response, err := client.Run(
		ctx,
		workspace,
		resourceType,
		resourceName,
		"POST",
		"/",
		map[string]string{},
		[]string{},
		string(inputBody),
		debug,
		local,
	)
	if err != nil {
		return "", fmt.Errorf("failed to send message: %w", err)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %w", err)
	}

	return string(body), nil
}
