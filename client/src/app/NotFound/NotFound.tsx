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
        <div className="rounded-full bg-yellow-100 p-4 mb-6">
          <AlertTriangle className="h-12 w-12 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404 Page not found</h1>
        <p className="text-lg text-gray-600 max-w-md mb-8">
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
