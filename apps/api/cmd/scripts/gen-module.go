package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Module name required: go run gen-module.go <module_name>")
		os.Exit(1)
	}
	module := strings.ToLower(os.Args[1])

	base := filepath.Join("internal", "modules", module)

	files := map[string]string{
		filepath.Join(base, module+".go"):    fmt.Sprintf("package %s\n\n// %s module\n", module, module),
		filepath.Join(base, "dto.go"):        fmt.Sprintf("package %s\n\n// %s DTOs\n", module, module),
		filepath.Join(base, "handler.go"):    fmt.Sprintf("package %s\n\n// %s handlers\n", module, module),
		filepath.Join(base, "repository.go"): fmt.Sprintf("package %s\n\n// %s repository\n", module, module),
		filepath.Join(base, "service.go"):    fmt.Sprintf("package %s\n\n// %s service\n", module, module),
		filepath.Join(base, "entity.go"):     fmt.Sprintf("package %s\n\n// %s entity\n", module, module),
	}

	if err := os.MkdirAll(base, os.ModePerm); err != nil {
		fmt.Printf("Failed to create base dir %s: %v\n", base, err)
		os.Exit(1)
	}

	for path, content := range files {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			if err := os.WriteFile(path, []byte(content), 0644); err != nil {
				fmt.Printf("Failed to write file %s: %v\n", path, err)
				os.Exit(1)
			}
			fmt.Printf("Created file: %s\n", path)
		} else {
			fmt.Printf("File already exists, skipping: %s\n", path)
		}
	}

	fmt.Printf("Module '%s' created successfully at %s!\n", module, base)
}
