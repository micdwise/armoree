import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../components/Button";
import { PageSection } from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const NotFound: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <PageSection>
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-bg-warning p-4 mb-6">
          <AlertTriangle className="h-12 w-12 text-text-warning" />
        </div>
        <h1 className="text-4xl font-bold text-default-font mb-2">404 Page not found</h1>
        <p className="text-lg text-subtext-color max-w-md mb-8">
          We didn't find a page that matched the address you navigated to.
        </p>
        <Button onClick={() => navigate("/Dashboard", { replace: true })}>
          Take me home
        </Button>
      </div>
    </PageSection>
  );
};

export { NotFound };
