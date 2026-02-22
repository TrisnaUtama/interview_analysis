from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig
from crawl4ai.async_crawler_strategy import AsyncCrawlResponse


class JobCrawler:
    def __init__(self, headless: bool = True, cache_mode: CacheMode = CacheMode.BYPASS):
        self.browser_config = BrowserConfig(headless=headless)
        self.run_config = CrawlerRunConfig(cache_mode=cache_mode)
        self.crawler: AsyncWebCrawler | None = None

    async def __aenter__(self) -> "JobCrawler":
        self.crawler = AsyncWebCrawler(config=self.browser_config)
        await self.crawler.__aenter__()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.crawler is not None:
            await self.crawler.__aexit__(exc_type, exc_val, exc_tb)

    async def crawl(self, url: str) -> AsyncCrawlResponse:
        if self.crawler is None:
            raise RuntimeError(
                "Crawler not initialized. Use async context manager or call start()"
            )

        result: AsyncCrawlResponse = await self.crawler.arun(
            url=url, config=self.run_config
        )  # type: ignore

        if not result.success:  # type: ignore
            raise ValueError(
                f"Failed to crawl URL: {url}. Error: {result.error_message}"  # type: ignore
            )

        return result
