import { Redis } from "@upstash/redis";
import { NextResponse, NextRequest } from "next/server";

export const runtime = "edge";
export const preferredRegion = "fra1";

export async function GET(req: NextRequest) {
  const iterations = 30;
  let latencies = [];

  for (let i = 0; i < iterations; i++) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const start = Date.now();
    try {
      await redis.set("json-test", data);
    } catch (error) {
      return NextResponse.json(
        { error: "Redis operation failed" },
        { status: 500 }
      );
    }
    const end = Date.now();
    latencies.push(end - start);
  }

  console.log({ latencies });
  latencies.sort((a, b) => a - b);
  const percentile95 = calculatePercentile(95, latencies);
  const percentile99 = calculatePercentile(99, latencies);

  // Calculating the average latency
  const averageElapsed =
    latencies.reduce((a, b) => a + b, 0) / latencies.length;

  return NextResponse.json({
    averageElapsed,
    percentile95,
    percentile99,
    iterations,
  });
}

const calculatePercentile = (n: number, array: any[]) => {
  if (array.length === 0) return 0;
  const index = Math.ceil((n / 100) * array.length) - 1;
  return array[index];
};

const data = [
  {
    posts: [
      { id: "1", title: "a title", views: 100 },
      { id: "2", title: "another title", views: 200 },
    ],
    comments: [
      { id: "1", text: "a comment about post 1", postId: "1" },
      { id: "2", text: "another comment about post 1", postId: "1" },
    ],
    profile: {
      name: "typicode",
    },
  },
  {
    posts: [
      { id: "1", title: "a title", views: 100 },
      { id: "2", title: "another title", views: 200 },
    ],
    comments: [
      { id: "1", text: "a comment about post 1", postId: "1" },
      { id: "2", text: "another comment about post 1", postId: "1" },
    ],
    profile: {
      name: "typicode",
    },
  },
  {
    posts: [
      { id: "1", title: "a title", views: 100 },
      { id: "2", title: "another title", views: 200 },
    ],
    comments: [
      { id: "1", text: "a comment about post 1", postId: "1" },
      { id: "2", text: "another comment about post 1", postId: "1" },
    ],
    profile: {
      name: "typicode",
    },
  },
  {
    posts: [
      { id: "1", title: "a title", views: 100 },
      { id: "2", title: "another title", views: 200 },
    ],
    comments: [
      { id: "1", text: "a comment about post 1", postId: "1" },
      { id: "2", text: "another comment about post 1", postId: "1" },
    ],
    profile: {
      name: "typicode",
    },
  },
  {
    posts: [
      { id: "1", title: "a title", views: 100 },
      { id: "2", title: "another title", views: 200 },
    ],
    comments: [
      { id: "1", text: "a comment about post 1", postId: "1" },
      { id: "2", text: "another comment about post 1", postId: "1" },
    ],
    profile: {
      name: "typicode",
    },
  },
];
