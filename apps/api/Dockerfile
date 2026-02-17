FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o /app/bin/api ./cmd/api/main.go

FROM alpine:3.19 AS runner

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata
COPY --from=builder /app/bin/api .
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/pkg/i18n ./pkg/i18n
COPY --from=builder /app/pkg/docs ./pkg/docs

EXPOSE ${PORT}

CMD ["./api"]