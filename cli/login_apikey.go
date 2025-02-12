package cli

import (
	"fmt"
	"os"

	"github.com/beamlit/toolkit/sdk"
)

func (r *Operations) ApiKeyLogin(workspace string, environment string) {
	var apiKey string
	// Check if API key is provided via environment variable
	if apiKey = os.Getenv("BL_API_KEY"); apiKey != "" {
		fmt.Println("Using API key from environment variable BL_API_KEY")
	} else {
		fmt.Println("Enter your API key :")
		for {
			_, err := fmt.Scanln(&apiKey)
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			if apiKey != "" {
				break
			}
			fmt.Println("API key cannot be empty. Please enter your API key")
		}
	}

	// Create credentials struct and marshal to JSON
	creds := sdk.Credentials{
		APIKey: apiKey,
	}

	workspaceObject, err := CheckWorkspaceAccess(workspace, creds)
	if err != nil {
		fmt.Printf("Error accessing workspace %s : %s\n", workspace, err)
		os.Exit(1)
	}
	if environment == "" && workspaceObject.DefaultEnvironment != nil {
		environment = *workspaceObject.DefaultEnvironment
	}

	sdk.SaveCredentials(workspace, creds)
	sdk.SetCurrentWorkspace(workspace, environment)
	fmt.Println("Successfully stored API key")
}
