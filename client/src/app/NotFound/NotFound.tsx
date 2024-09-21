import * as React from "react";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  PageSection,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";

const NotFound: React.FunctionComponent = () => {
  function GoHomeBtn() {
    const navigate = useNavigate();
    function handleClick() {
      navigate("/Dashboard", { replace: true });
    }
    return <Button onClick={handleClick}>Take me home</Button>;
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <EmptyState
        headingLevel="h1"
        icon={ExclamationTriangleIcon}
        titleText="404 Page not found"
        variant="full">
        <EmptyStateBody>
          We didn't find a page that matched the address you navigated to.
        </EmptyStateBody>
        <EmptyStateFooter>
          <GoHomeBtn />
        </EmptyStateFooter>
      </EmptyState>
    </PageSection>
  );
};

export { NotFound };
