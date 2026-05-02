"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from "recharts";
import { NetworkGraph } from "@/components/dashboard/NetworkGraph";
import { MessageSquare, ThumbsUp, BarChart3, TrendingUp, Search, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

const COLORS = {
  positive: "#10b981", // Emerald
  negative: "#ef4444", // Red
  neutral: "#94a3b8",  // Slate
};

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("유튜브 영상 URL 또는 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url;
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) throw new Error("분석에 실패했습니다.");

      const result = await response.json();
      setData(result);
      toast.success("분석이 완료되었습니다!");
    } catch (error) {
      console.error(error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const sentimentData = data ? [
    { name: "긍정", value: data.sentimentDistribution.positive, color: COLORS.positive },
    { name: "부정", value: data.sentimentDistribution.negative, color: COLORS.negative },
    { name: "중립", value: data.sentimentDistribution.neutral, color: COLORS.neutral },
  ] : [];

  return (
    <main className="min-h-screen bg-[#f4f4f5] p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">유튜브 댓글 AI 분석</h1>
            <p className="text-gray-500">Gemini 3.1 Flash Lite 기반 실시간 분석 대시보드</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input 
              placeholder="유튜브 URL 또는 영상 ID 입력" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white shadow-sm border-gray-200"
            />
            <Button onClick={handleAnalyze} disabled={loading} className="bg-[#7c3aed] hover:bg-[#6d28d9]">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              분석하기
            </Button>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        )}

        {!loading && data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl shadow-sm border-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">총 댓글 수</p>
                      <p className="text-2xl font-bold">{data.stats.totalAnalyzed}</p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-xl">
                      <MessageSquare className="text-[#7c3aed] h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm border-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">평균 글자 수</p>
                      <p className="text-2xl font-bold">{data.stats.averageLength.toFixed(1)}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <BarChart3 className="text-blue-600 h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm border-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">긍정 비율</p>
                      <p className="text-2xl font-bold">
                        {((data.sentimentDistribution.positive / data.stats.totalAnalyzed) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-emerald-100 p-2 rounded-xl">
                      <ThumbsUp className="text-emerald-600 h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm border-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">상위 키워드</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {data.keywords.slice(0, 2).map((k: string) => (
                          <Badge key={k} variant="secondary" className="bg-gray-100">{k}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-xl">
                      <TrendingUp className="text-orange-600 h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sentiment Pie */}
              <Card className="rounded-2xl shadow-sm border-none lg:col-span-1">
                <CardHeader>
                  <CardTitle>감정 분포</CardTitle>
                  <CardDescription>댓글의 긍정/부정/중립 비율</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sentiment Over Time */}
              <Card className="rounded-2xl shadow-sm border-none lg:col-span-2">
                <CardHeader>
                  <CardTitle>시간대별 감정 추이</CardTitle>
                  <CardDescription>날짜별 긍정, 부정, 중립 댓글 수 변화</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="positive" stackId="1" stroke={COLORS.positive} fill={COLORS.positive} fillOpacity={0.4} />
                      <Area type="monotone" dataKey="negative" stackId="1" stroke={COLORS.negative} fill={COLORS.negative} fillOpacity={0.4} />
                      <Area type="monotone" dataKey="neutral" stackId="1" stroke={COLORS.neutral} fill={COLORS.neutral} fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Comment Volume Line Chart */}
              <Card className="rounded-2xl shadow-sm border-none lg:col-span-1">
                <CardHeader>
                  <CardTitle>댓글 작성 추이</CardTitle>
                  <CardDescription>날짜별 총 댓글 작성 수</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bigram Network */}
              <Card className="rounded-2xl shadow-sm border-none lg:col-span-2">
                <CardHeader>
                  <CardTitle>언어 네트워크 분석</CardTitle>
                  <CardDescription>자주 함께 쓰이는 단어 쌍 (Bigram) 시각화</CardDescription>
                </CardHeader>
                <CardContent>
                  <NetworkGraph data={data.bigrams} />
                </CardContent>
              </Card>
            </div>

            {/* Analyzed Comments Table */}
            <Card className="rounded-2xl shadow-sm border-none">
              <CardHeader>
                <CardTitle>상세 분석 결과</CardTitle>
                <CardDescription>수집된 댓글별 감정 및 요약</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="bg-gray-100 rounded-xl p-1 mb-4">
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="positive">긍정</TabsTrigger>
                    <TabsTrigger value="negative">부정</TabsTrigger>
                    <TabsTrigger value="neutral">중립</TabsTrigger>
                  </TabsList>
                  {["all", "positive", "negative", "neutral"].map((type) => (
                    <TabsContent key={type} value={type} className="space-y-4">
                      <div className="grid gap-4">
                        {data.rawComments
                          .filter((c: any, i: number) => type === "all" || data.analyzedComments[i]?.sentiment === type)
                          .slice(0, 10)
                          .map((comment: any, i: number) => {
                            const analysis = data.analyzedComments.find((a: any) => a.id === comment.id) || data.analyzedComments[i];
                            return (
                              <div key={comment.id} className="flex gap-4 p-4 bg-white border rounded-2xl hover:shadow-md transition-shadow">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">{comment.author}</span>
                                    <Badge 
                                      className={
                                        analysis?.sentiment === "positive" ? "bg-emerald-100 text-emerald-700" :
                                        analysis?.sentiment === "negative" ? "bg-red-100 text-red-700" :
                                        "bg-gray-100 text-gray-700"
                                      }
                                      variant="outline"
                                    >
                                      {analysis?.sentiment || "neutral"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700 line-clamp-2">{comment.text}</p>
                                  <p className="text-xs text-gray-400 italic">AI 요약: {analysis?.summary}</p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && !data && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
            <div className="bg-white p-8 rounded-full shadow-sm">
              <Search className="h-12 w-12 text-gray-200" />
            </div>
            <p>분석할 유튜브 영상 URL을 입력해주세요.</p>
          </div>
        )}
      </div>
    </main>
  );
}
