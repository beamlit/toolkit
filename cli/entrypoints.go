package cli

type Entrypoints struct {
	Production  string `toml:"prod"`
	Development string `toml:"dev"`
}
