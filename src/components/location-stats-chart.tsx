import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

const chartConfig = {
    city: {
        label: "City",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const LocationStatsChart = ({ stats }: { stats: any[] }) => {

    const cityCount = stats.reduce<Record<string, number>>((acc, item) => {
        const city = item.city || "Unknown";

        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    // Convert to array + sort descending
    const cities = Object.entries(cityCount).map(([city, count]) => ({
        city, count
    })).sort((a, b) => b.count - a.count);

    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle>Top Locations</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={cities.slice(0, 5)}
                        margin={{
                            left: -30,
                            right: 0,
                            top: 10
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="city"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value: string) => value.slice(0, 5)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                            domain={[0, "auto"]}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                        <ChartLegend
                            content={<ChartLegendContent nameKey="city" />}
                            className="translate-y-0 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                        <Line
                            dataKey="count"
                            type="monotone"
                            stroke="grey"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default LocationStatsChart