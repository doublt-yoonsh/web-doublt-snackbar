import { gotScraping } from "got-scraping";

const url = process.argv[2];
if (!url) {
  console.log(JSON.stringify({ error: "URL이 필요합니다" }));
  process.exit(1);
}

function extractTitle(body) {
  const ogMatch = body.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
  );
  if (ogMatch) {
    return ogMatch[1].replace(/\s*[-|]\s*쿠팡!?$/, "").replace(/\s*-\s*[^,]+$/, "").trim();
  }

  const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    if (title !== "Access Denied" && title !== "Just a moment...") {
      return title.replace(/\s*[-|]\s*쿠팡!?$/, "").replace(/\s*-\s*[^,]+$/, "").trim();
    }
  }

  return null;
}

async function tryFetch(targetUrl, headerGeneratorOptions) {
  const { body, statusCode } = await gotScraping({
    url: targetUrl,
    headerGeneratorOptions,
    timeout: { request: 8000 },
  });

  if (statusCode !== 200) throw new Error(`status ${statusCode}`);

  const title = extractTitle(body);
  if (!title) throw new Error("no title found");

  return title;
}

try {
  // Run all fingerprints in parallel, take the first success
  const productName = await Promise.any([
    tryFetch(url, {
      browsers: [{ name: "chrome", minVersion: 120 }],
      devices: ["desktop"],
      locales: ["ko-KR"],
      operatingSystems: ["macos"],
    }),
    tryFetch(url, {
      browsers: [{ name: "firefox", minVersion: 115 }],
      devices: ["desktop"],
      locales: ["ko-KR"],
      operatingSystems: ["windows"],
    }),
    tryFetch(url.replace("www.coupang.com", "m.coupang.com"), {
      browsers: [{ name: "chrome", minVersion: 120 }],
      devices: ["mobile"],
      locales: ["ko-KR"],
      operatingSystems: ["android"],
    }),
  ]);

  console.log(JSON.stringify({ productName }));
} catch {
  console.log(
    JSON.stringify({ error: "상품명을 가져올 수 없습니다. 직접 입력해주세요." })
  );
}
