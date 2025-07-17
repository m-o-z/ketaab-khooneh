package util

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sort"
)

func LogResponse(resp *http.Response) error {
	// Log the status code and status text
	log.Printf("Status: %d %s\n", resp.StatusCode, resp.Status)

	// Log headers in a sorted, readable format
	log.Println("Headers:")
	keys := make([]string, 0, len(resp.Header))
	for key := range resp.Header {
		keys = append(keys, key)
	}
	sort.Strings(keys) // Sort for consistent output
	for _, key := range keys {
		log.Printf("  %s: %s", key, resp.Header.Get(key))
	}

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}
	// Ensure the response body is closed
	defer resp.Body.Close()

	// Check if body is valid JSON
	var jsonData interface{}
	if err := json.Unmarshal(body, &jsonData); err != nil {
		// If not JSON, log as plain text
		log.Printf("Body (non-JSON):\n%s\n", string(body))
		return nil
	}

	// Pretty-print JSON with indentation
	prettyJSON, err := json.MarshalIndent(jsonData, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to format JSON: %w", err)
	}
	log.Printf("Body (JSON):\n%s\n", string(prettyJSON))

	return nil
}
