import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL이 필요합니다" },
        { status: 400 }
      );
    }

    const ALLOWED_DOMAINS = ["www.coupang.com", "m.coupang.com"];
    try {
      const parsed = new URL(url);
      if (
        parsed.protocol !== "https:" ||
        !ALLOWED_DOMAINS.some((d) => parsed.hostname === d)
      ) {
        return NextResponse.json(
          { error: "쿠팡 URL만 허용됩니다" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "올바른 URL 형식이 아닙니다" },
        { status: 400 }
      );
    }

    const scriptPath = path.join(process.cwd(), "scripts", "fetch-product.mjs");
    const { stdout } = await execFileAsync("node", [scriptPath, url], {
      timeout: 15000,
    });

    const result = JSON.parse(stdout.trim());

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ productName: result.productName });
  } catch {
    return NextResponse.json(
      { error: "상품 정보를 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
