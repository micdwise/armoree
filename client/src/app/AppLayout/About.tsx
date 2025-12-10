import * as React from "react";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/Button";
import { HelpCircle } from "lucide-react";

const AboutModalBasic: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        aria-label="Help"
        variant="link"
        onClick={() => setIsModalOpen(true)}
      >
        <HelpCircle className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="About Armoree"
        description="Armoree Application Information"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-center mb-4">
            <img src="/ArmoreeLogo.png" alt="Armoree Logo" className="h-16 w-auto" />
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Version:</span>
              <span>1.0.0</span>

              <span className="font-semibold">Server name:</span>
              <span>40DemoMaster</span>

              <span className="font-semibold">User name:</span>
              <span>Administrator</span>

              <span className="font-semibold">User role:</span>
              <span>Super Admin</span>

              <span className="font-semibold">Browser/OS:</span>
              <span>{navigator.userAgent}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Armoree. All rights reserved.
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export { AboutModalBasic };
