package sdk

import (
	"context"
	"fmt"
	"net/http"
)

const BaseURL = "https://api.example.org/"

func NewApiKeyProvider(apikey string, workspaceName string) *ApiKeyAuth {
	return &ApiKeyAuth{apikey: apikey, workspaceName: workspaceName}
}

func (s *ApiKeyAuth) Intercept(ctx context.Context, req *http.Request) error {
	req.Header.Set("X-Beamlit-Api-Key", s.apikey)
	req.Header.Set("X-Beamlit-Workspace", s.workspaceName)
	return nil
}

func NewBearerTokenProvider(token string, workspaceName string) *BearerToken {
	return &BearerToken{token: token, workspaceName: workspaceName}
}

func (s *BearerToken) Intercept(ctx context.Context, req *http.Request) error {
	req.Header.Set("X-Beamlit-Authorization", fmt.Sprintf("Bearer %s", s.token))
	req.Header.Set("X-Beamlit-Workspace", s.workspaceName)
	return nil
}

func NewPublicProvider() *PublicProvider {
	return &PublicProvider{}
}

func (s *PublicProvider) Intercept(ctx context.Context, req *http.Request) error {
	return nil
}

type AuthProvider interface {
	Intercept(ctx context.Context, req *http.Request) error
}
