"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AnimatedCounter,
  EmptyState,
  HealthIndicator,
  LoadingCard,
  MetricValue,
  SectionTitle,
  StatusBadge,
  StatusDot,
  TrendIndicator,
} from "@/components/common";
import {
  CardContent,
  CardHeader,
  CardHeaderDescription,
  CardHeaderTitle,
  DashboardCard,
  DashboardGrid,
  PageContainer,
} from "@/components/dashboard";
import { Info } from "lucide-react";

export function DesignSystemShowcase() {
  return (
    <PageContainer className="space-y-10">
      <SectionTitle
        eyebrow="Phase 2"
        title="Design system components."
        description="Reusable primitives styled with the Vercel-inspired token set. No telemetry wiring yet."
      />

      <section className="space-y-4">
        <SectionTitle title="Status & metrics" />
        <DashboardGrid columns={4}>
          <DashboardCard>
            <CardHeader>
              <CardHeaderTitle>CPU usage</CardHeaderTitle>
              <CardHeaderDescription>Sample static value</CardHeaderDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <MetricValue value={42.8} unit="%" decimals={1} label="Current" />
              <TrendIndicator value={2.4} />
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardHeader
              action={<StatusBadge status="healthy" />}
            >
              <CardHeaderTitle>Service health</CardHeaderTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <HealthIndicator status="healthy" />
              <HealthIndicator status="degraded" />
              <div className="flex gap-3">
                <StatusDot status="connected" pulse />
                <StatusDot status="warning" />
                <StatusDot status="error" />
              </div>
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardHeader>
              <CardHeaderTitle>Animated counter</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <p className="text-display-lg font-semibold tracking-display-lg text-ink tabular-nums">
                <AnimatedCounter value={1284} />
              </p>
            </CardContent>
          </DashboardCard>

          <LoadingCard />
        </DashboardGrid>
      </section>

      <section className="space-y-4">
        <SectionTitle title="shadcn primitives" />
        <DashboardGrid columns={2}>
          <DashboardCard>
            <CardHeader>
              <CardHeaderTitle>Tabs & progress</CardHeaderTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="1h">
                <TabsList>
                  <TabsTrigger value="1h">1h</TabsTrigger>
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7d</TabsTrigger>
                </TabsList>
                <TabsContent value="1h">
                  <Progress value={68} className="mt-2" />
                </TabsContent>
                <TabsContent value="24h">
                  <Progress value={42} className="mt-2" />
                </TabsContent>
                <TabsContent value="7d">
                  <Progress value={81} className="mt-2" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardHeader>
              <CardHeaderTitle>Overlays</CardHeaderTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Component preview</DialogTitle>
                    <DialogDescription>
                      Dialog surfaces use elevation level 5 from the design system.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-body-sm text-body">
                    Lightweight contextual content.
                  </p>
                </PopoverContent>
              </Popover>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="sm">
                    Hover card
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-body-sm font-medium text-ink">Metric hint</p>
                  <p className="mt-1 text-caption text-mute">
                    Hover for additional context without a click.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Export CSV</DropdownMenuItem>
                  <DropdownMenuItem>Refresh view</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </DashboardCard>
        </DashboardGrid>
      </section>

      <section className="space-y-4">
        <SectionTitle title="Feedback & data" />
        <DashboardGrid columns={2}>
          <DashboardCard>
            <CardHeader>
              <CardHeaderTitle>Alerts</CardHeaderTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert variant="info">
                <Info className="size-4" />
                <AlertTitle>Informational</AlertTitle>
                <AlertDescription>
                  System operating within expected parameters.
                </AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Elevated latency</AlertTitle>
                <AlertDescription>
                  p95 latency exceeded the configured threshold.
                </AlertDescription>
              </Alert>
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardHeader>
              <CardHeaderTitle>Table preview</CardHeaderTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>api-gateway</TableCell>
                    <TableCell>
                      <Badge variant="success">Healthy</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>worker-pool</TableCell>
                    <TableCell>
                      <Badge variant="warning">Degraded</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </DashboardCard>
        </DashboardGrid>
      </section>

      <section className="space-y-4">
        <Accordion type="single" collapsible className="rounded-md border border-border bg-card px-4 shadow-elevation-2">
          <AccordionItem value="tokens">
            <AccordionTrigger>Design token reference</AccordionTrigger>
            <AccordionContent>
              Components use canvas surfaces, hairline borders, mono captions,
              and stacked elevation shadows from DESIGN.md.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <EmptyState
          title="No events yet"
          description="Empty states use generous padding on canvas-soft with a subtle elevated icon frame."
          actionLabel="Learn more"
          onAction={() => undefined}
        />
      </section>
    </PageContainer>
  );
}
