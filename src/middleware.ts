import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const iterations = 30;
  let latencies = [];

  for (let i = 0; i < iterations; i++) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const start = Date.now();
    try {
      await redis.incr("test-123");
    } catch (error) {
      return NextResponse.json(
        { error: "Redis operation failed" },
        { status: 500 }
      );
    }
    const end = Date.now();
    latencies.push(end - start);
  }

  latencies.sort((a, b) => a - b);
  const percentile95 = calculatePercentile(95, latencies);
  const percentile99 = calculatePercentile(99, latencies);

  // Calculating the average latency
  const averageElapsed =
    latencies.reduce((a, b) => a + b, 0) / latencies.length;

  console.log({ latencies, percentile95, percentile99, averageElapsed });
  return;
}

const calculatePercentile = (n: number, array: any[]) => {
  if (array.length === 0) return 0;
  const index = Math.ceil((n / 100) * array.length) - 1;
  return array[index];
};

export const config = {
  matcher: "/about/:path*",
};
