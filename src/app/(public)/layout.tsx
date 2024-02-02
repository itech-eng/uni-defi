import LayoutWithHeaderAndFooter from "@/src/components/layouts/layout-with-header-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <LayoutWithHeaderAndFooter>{children}</LayoutWithHeaderAndFooter>
    </section>
  );
}
