package cli

import (
	"fmt"
	"os"
	"os/user"
	"regexp"

	"github.com/blaxel-ai/toolkit/cli/core"
	"github.com/charmbracelet/huh"
	"github.com/spf13/cobra"
)

func init() {
	core.RegisterCommand("create-job", func() *cobra.Command {
		return CreateJobCmd()
	})
}

// CreateJobCmd returns a cobra.Command that implements the 'create-job' CLI command.
// The command creates a new Blaxel job in the specified directory after collecting
// necessary configuration through an interactive prompt.
// Usage: bl create-job directory [--template template-name]
func CreateJobCmd() *cobra.Command {
	var templateName string
	var noTTY bool

	cmd := &cobra.Command{
		Use:     "create-job directory",
		Args:    cobra.MaximumNArgs(2),
		Aliases: []string{"cj", "cjob"},
		Short:   "Create a new blaxel job",
		Long:    "Create a new blaxel job",
		Example: `
bl create-job my-job
bl create-job my-job --template template-jobs-ts
bl create-job my-job --template template-jobs-ts -y`,
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) < 1 {
				core.PrintError("Job creation", fmt.Errorf("directory name is required"))
				return
			}
			// Check if directory already exists
			if _, err := os.Stat(args[0]); !os.IsNotExist(err) {
				core.PrintError("Job creation", fmt.Errorf("directory '%s' already exists", args[0]))
				return
			}

			// Retrieve templates using the new reusable function
			templates, err := core.RetrieveTemplatesWithSpinner("job", noTTY, "Job creation")
			if err != nil {
				os.Exit(1)
			}

			var opts core.TemplateOptions
			// If template is specified via flag or skip prompts is enabled, skip interactive prompt
			if templateName != "" {
				opts = core.CreateDefaultTemplateOptions(args[0], templateName, templates)
				if opts.TemplateName == "" {
					core.PrintError("Job creation", fmt.Errorf("template '%s' not found", templateName))
					fmt.Println("Available templates:")
					for _, template := range templates {
						key := regexp.MustCompile(`^\d+-`).ReplaceAllString(*template.Name, "")
						fmt.Printf("  %s (%s)\n", key, template.Language)
					}
					return
				}
			} else {
				opts = promptCreateJob(args[0], templates)
			}

			// Clone template using the new reusable function
			if err := core.CloneTemplateWithSpinner(opts, templates, noTTY, "Job creation", "Creating your blaxel job..."); err != nil {
				return
			}

			core.CleanTemplate(opts.Directory)

			// Success message with colors
			core.PrintSuccess("Your blaxel job has been created successfully!")
			fmt.Printf(`Start working on it:
  cd %s
  bl run job %s --local --file batches/sample-batch.json
`, opts.Directory, opts.Directory)
		},
	}

	cmd.Flags().StringVarP(&templateName, "template", "t", "", "Template to use for the job (skips interactive prompt)")
	cmd.Flags().BoolVarP(&noTTY, "yes", "y", false, "Skip interactive prompts and use defaults")
	return cmd
}

// promptCreateJob displays an interactive form to collect user input for creating a new job.
// It prompts for project name, language selection, template, author, license, and additional features.
// Takes a directory string parameter and returns a CreateJobOptions struct with the user's selections.
func promptCreateJob(directory string, templates core.Templates) core.TemplateOptions {
	jobOptions := core.TemplateOptions{
		ProjectName:  directory,
		Directory:    directory,
		TemplateName: "",
	}
	currentUser, err := user.Current()
	if err == nil {
		jobOptions.Author = currentUser.Username
	} else {
		jobOptions.Author = "blaxel"
	}
	languagesOptions := []huh.Option[string]{}
	for _, language := range templates.GetLanguages() {
		languagesOptions = append(languagesOptions, huh.NewOption(language, language))
	}
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewInput().
				Title("Project Name").
				Description("Name of your job").
				Value(&jobOptions.ProjectName),
			huh.NewSelect[string]().
				Title("Language").
				Description("Language to use for your job").
				Height(5).
				Options(languagesOptions...).
				Value(&jobOptions.Language),
			huh.NewSelect[string]().
				Title("Template").
				Description("Template to use for your job").
				Height(5).
				OptionsFunc(func() []huh.Option[string] {
					if len(templates) == 0 {
						return []huh.Option[string]{}
					}
					options := []huh.Option[string]{}
					for _, template := range templates.FilterByLanguage(jobOptions.Language) {
						key := regexp.MustCompile(`^\d+-`).ReplaceAllString(*template.Name, "")
						options = append(options, huh.NewOption(key, *template.Name))
					}
					return options
				}, &jobOptions).
				Value(&jobOptions.TemplateName),
		),
	)
	form.WithTheme(core.GetHuhTheme())
	err = form.Run()
	if err != nil {
		fmt.Println("Cancel create blaxel job")
		os.Exit(0)
	}
	return jobOptions
}
