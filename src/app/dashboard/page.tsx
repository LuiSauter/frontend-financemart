import React from "react";

export const metadata = {
  title: "Dashboard",
};

// export type ClusterType = RouterOutputs["k8s"]["getClusters"][number];
export default async function DashboardPage() {
  //don't need to check auth here, because we have a global auth check in _app.tsx
  // const user = await getCurrentUser();
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
