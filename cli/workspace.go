package cli

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os"

	"github.com/beamlit/toolkit/sdk"
	"github.com/spf13/cobra"
)

func (r *Operations) ListOrSetWorkspacesCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "workspaces [workspace] [environment]",
		Aliases: []string{"ws", "workspace"},
		Short:   "List all workspaces with the current workspace highlighted, set optionally a new current workspace and environment",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) > 0 {
				if len(args) > 1 {
					sdk.SetCurrentWorkspace(args[0], args[1])
				} else {
					sdk.SetCurrentWorkspace(args[0], "")
				}
			}

			workspaces := sdk.ListWorkspaces()
			currentWorkspace := sdk.CurrentContext().Workspace

			// En-têtes avec largeurs fixes
			fmt.Printf("%-30s %-20s %-20s\n", "NAME", "ENVIRONMENT", "CURRENT")

			// Afficher chaque workspace avec les mêmes largeurs fixes
			for _, workspace := range workspaces {
				current := " "
				if workspace == currentWorkspace {
					current = "*"
				}
				env := ""
				if workspace == currentWorkspace {
					env = sdk.CurrentContext().Environment
				}
				fmt.Printf("%-30s %-20s %-10s\n", workspace, env, current)
			}
		},
	}
}

func CheckWorkspaceAccess(workspaceName string, credentials sdk.Credentials) error {
	c, err := sdk.NewClientWithCredentials(
		sdk.RunClientWithCredentials{
			ApiURL:      BASE_URL,
			RunURL:      RUN_URL,
			Credentials: credentials,
			Workspace:   workspace,
		},
	)
	if err != nil {
		return err
	}
	response, err := c.GetWorkspace(context.Background(), workspaceName)
	if err != nil {
		return err
	}
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, response.Body); err != nil {
		formattedError := fmt.Sprintf("Resource %s error: ", "workspace")
		fmt.Printf("%s%v", formattedError, err)
		os.Exit(1)
	}
	if response.StatusCode >= 400 {
		ErrorHandler(response.Request, "workspace", workspaceName, buf.String())
		os.Exit(1)
	}
	return nil
}
