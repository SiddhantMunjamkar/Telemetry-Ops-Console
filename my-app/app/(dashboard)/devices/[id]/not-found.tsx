import { ErrorState } from "@/components/common/ErrorState";

export default function DeviceNotFound() {
  return (
    <ErrorState
      title="Device not found"
      description="The equipment you are looking for does not exist in the mock fleet inventory. It may have been removed or the link is incorrect."
      actionLabel="Back to devices"
      actionHref="/devices"
    />
  );
}
