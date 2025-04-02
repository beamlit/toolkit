package cli

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/user"
	"regexp"

	"github.com/beamlit/toolkit/sdk"
	"github.com/charmbracelet/huh"
	"github.com/charmbracelet/huh/spinner"
	"github.com/spf13/cobra"
)

func promptMCPServerTemplateConfig(templates Templates, mcpserverOptions *TemplateOptions) {
	templateConfig, err := templates.find(mcpserverOptions.Language, mcpserverOptions.Template.Name).getConfig()
	if err != nil {
		fmt.Println("Could not retrieve template configuration")
		os.Exit(0)
	}
	fields := []huh.Field{}
	values := map[string]*string{}
	array_values := map[string]*[]string{}
	mapped_values := map[string]string{}
	for _, variable := range templateConfig.Variables {
		var value string
		var array_value []string

		title := variable.Name
		if variable.Label != nil {
			title = *variable.Label
		}
		if variable.Type == "select" {
			values[variable.Name] = &value
			options := []huh.Option[string]{}
			if variable.File != "" {
				mcpserverOptions.IgnoreFiles[variable.Name] = IgnoreFile{File: variable.File, Skip: variable.Skip}
			}
			if variable.Folder != "" {
				mcpserverOptions.IgnoreDirs[variable.Name] = IgnoreDir{Folder: variable.Folder, Skip: variable.Skip}
			}
			for _, option := range variable.Options {
				options = append(options, huh.NewOption(option.Label, option.Value))
			}
			input := huh.NewSelect[string]().
				Title(title).
				Description(variable.Description).
				Options(options...).
				Value(&value)
			fields = append(fields, input)
		} else if variable.Type == "input" {
			values[variable.Name] = &value
			input := huh.NewInput().
				Title(title).
				Description(variable.Description).
				Value(&value)
			fields = append(fields, input)
		} else if variable.Type == "multiselect" {
			array_values[variable.Name] = &array_value
			options := []huh.Option[string]{}
			for _, option := range variable.Options {
				mapped_values[option.Value] = option.Name
				if option.File != "" {
					mcpserverOptions.IgnoreFiles[option.Name] = IgnoreFile{File: option.File, Skip: option.Skip}
				}
				if option.Folder != "" {
					mcpserverOptions.IgnoreDirs[option.Name] = IgnoreDir{Folder: option.Folder, Skip: option.Skip}
				}
				options = append(options, huh.NewOption(option.Label, option.Value))
			}
			input := huh.NewMultiSelect[string]().
				Title(title).
				Description(variable.Description).
				Options(options...).
				Value(&array_value)
			fields = append(fields, input)
		}
	}

	if len(fields) > 0 {
		formTemplates := huh.NewForm(
			huh.NewGroup(fields...),
		)
		formTemplates.WithTheme(GetHuhTheme())
		err = formTemplates.Run()
		if err != nil {
			fmt.Println("Cancel create blaxel mcp server")
			os.Exit(0)
		}
	}
	mcpserverOptions.TemplateOptions = values
	for _, array_value := range array_values {
		for _, value := range *array_value {
			k := mapped_values[value]
			mcpserverOptions.TemplateOptions[k] = &value
		}
	}
}

// promptCreateMCPServer displays an interactive form to collect user input for creating a new mcp server.
// It prompts for project name, language selection, template, author, license, and additional features.
// Takes a directory string parameter and returns a CreateMCPServerOptions struct with the user's selections.
func promptCreateMCPServer(directory string) TemplateOptions {
	mcpserverOptions := TemplateOptions{
		ProjectName: directory,
		Directory:   directory,
		IgnoreFiles: map[string]IgnoreFile{},
		IgnoreDirs:  map[string]IgnoreDir{},
	}
	currentUser, err := user.Current()
	if err == nil {
		mcpserverOptions.Author = currentUser.Username
	} else {
		mcpserverOptions.Author = "blaxel"
	}
	templates, err := RetrieveTemplates("mcp")
	if err != nil {
		fmt.Println("Could not retrieve templates")
		os.Exit(0)
	}
	languagesOptions := []huh.Option[string]{}
	for _, language := range templates.getLanguages() {
		languagesOptions = append(languagesOptions, huh.NewOption(language, language))
	}
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewInput().
				Title("Project Name").
				Description("Name of your mcp server").
				Value(&mcpserverOptions.ProjectName),
			huh.NewSelect[string]().
				Title("Language").
				Description("Language to use for your mcp server").
				Height(5).
				Options(languagesOptions...).
				Value(&mcpserverOptions.Language),
			huh.NewSelect[string]().
				Title("Template").
				Description("Template to use for your mcp server").
				Height(5).
				OptionsFunc(func() []huh.Option[string] {
					if len(templates) == 0 {
						return []huh.Option[string]{}
					}
					options := []huh.Option[string]{}
					for _, template := range templates.filterByLanguage(mcpserverOptions.Language) {
						key := regexp.MustCompile(`^\d+-`).ReplaceAllString(template.Name, "")
						options = append(options, huh.NewOption(key, template.Name))
					}
					return options
				}, &mcpserverOptions).
				Value(&mcpserverOptions.Template.Name),
		),
	)
	form.WithTheme(GetHuhTheme())
	err = form.Run()
	if err != nil {
		fmt.Println("Cancel create blaxel mcp server")
		os.Exit(0)
	}
	promptMCPServerTemplateConfig(templates, &mcpserverOptions)

	return mcpserverOptions
}

// CreateMCPServerCmd returns a cobra.Command that implements the 'create-mcpserver' CLI command.
// The command creates a new Blaxel mcp server in the specified directory after collecting
// necessary configuration through an interactive prompt.
// Usage: bl create-mcpserver directory
func (r *Operations) CreateMCPServerCmd() *cobra.Command {

	cmd := &cobra.Command{
		Use:     "create-mcp-server directory",
		Args:    cobra.MaximumNArgs(2),
		Aliases: []string{"cm", "cms"},
		Short:   "Create a new blaxel mcp server",
		Long:    "Create a new blaxel mcp server",
		Example: `bl create-mcpserver my-mcp-server`,
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) < 1 {
				fmt.Println("Please provide a directory name")
				return
			}
			// Check if directory already exists
			if _, err := os.Stat(args[0]); !os.IsNotExist(err) {
				fmt.Printf("Error: %s already exists\n", args[0])
				return
			}
			opts := promptCreateMCPServer(args[0])

			var err error
			spinnerErr := spinner.New().
				Title("Creating your blaxel mcp server...").
				Action(func() {
					err = opts.Template.Clone(opts)
				}).
				Run()
			if spinnerErr != nil {
				fmt.Println("Error creating mcp server", spinnerErr)
				return
			}
			if err != nil {
				fmt.Println("Error creating mcp server", err)
				os.RemoveAll(opts.Directory)
				return
			}
			res, err := client.ListModels(context.Background())
			if err != nil {
				return
			}

			body, err := io.ReadAll(res.Body)
			if err != nil {
				return
			}

			var models []sdk.Model
			err = json.Unmarshal(body, &models)
			if err != nil {
				return
			}
			fmt.Printf(`Your blaxel mcp server has been created. Start working on it:
cd %s;
bl serve --hotreload;
`, opts.Directory)
		},
	}
	return cmd
}
