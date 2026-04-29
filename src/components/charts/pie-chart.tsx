import { Pie, PieChart } from "recharts"

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
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

const DevicePieChart = ({ stats }: { stats: any[] }) => {

    const deviceCount = stats.reduce<Record<string, number>>((acc, item) => {
        const device = item.device || "Unknown";

        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {})

    const devices = Object.entries(deviceCount).map(([device, count]) => ({
        device, count, fill: chartConfig[device?.toLowerCase() as keyof typeof chartConfig].color || "var(--chart-1)"
    })).sort((a, b) => b.count - a.count)

    return (
        <Card className="flex flex-col rounded-lg">
            <CardHeader className="items-center pb-0">
                <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] px-0"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="device" hideLabel />}
                        />
                        <Pie
                            data={devices}
                            dataKey="count"
                            nameKey="device"
                            labelLine={false}
                            label={({ payload, ...props }) => {
                                return (
                                    <text
                                        cx={props.cx}
                                        cy={props.cy}
                                        x={props.x}
                                        y={props.y}
                                        textAnchor={props.textAnchor}
                                        dominantBaseline={props.dominantBaseline}
                                        fill="var(--foreground)"
                                    >
                                        {payload.value}
                                    </text>
                                )
                            }}
                        />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="device" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default DevicePieChart;
