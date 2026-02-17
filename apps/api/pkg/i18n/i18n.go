package i18n

import (
	"bytes"
	"encoding/json"
	"os"
	"text/template"
)

type I18n struct {
	messages map[string]map[string]string
	fallback string
}

var instance *I18n

func Init(localesDir, fallback string) error {
	i := &I18n{
		messages: make(map[string]map[string]string),
		fallback: fallback,
	}

	locales := []string{"en", "id"}
	for _, locale := range locales {
		path := localesDir + "/" + locale + ".json"
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		var msgs map[string]string
		if err := json.Unmarshal(data, &msgs); err != nil {
			return err
		}
		i.messages[locale] = msgs
	}

	instance = i
	return nil
}

func T(locale, key string, data ...map[string]string) string {
	if instance == nil {
		return key
	}

	msgs, ok := instance.messages[locale]
	if !ok {
		msgs = instance.messages[instance.fallback]
	}

	msg, ok := msgs[key]
	if !ok {
		msg = instance.messages[instance.fallback][key]
		if msg == "" {
			return key
		}
	}

	if len(data) > 0 {
		tmpl, err := template.New("").Parse(msg)
		if err != nil {
			return msg
		}
		var buf bytes.Buffer
		if err := tmpl.Execute(&buf, data[0]); err != nil {
			return msg
		}
		return buf.String()
	}

	return msg
}

func GetLocale(acceptLanguage string) string {
	if len(acceptLanguage) >= 2 {
		lang := acceptLanguage[:2]
		if lang == "id" {
			return "id"
		}
	}
	return "en"
}
