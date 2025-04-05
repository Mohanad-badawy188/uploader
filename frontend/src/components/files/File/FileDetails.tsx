import React from "react";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileItem } from "@/types/File";
import DetailsTab from "./DetailsTab";
import ContentTab from "./ContentTab";
export default function FileDetails({ file }: { file: FileItem }) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="details" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="details"
              className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 ${
                activeTab === "details" ? "border-primary" : ""
              }`}
            >
              Details
            </TabsTrigger>
            {file.extractedText && (
              <TabsTrigger
                value="content"
                className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 ${
                  activeTab === "content" ? "border-primary" : ""
                }`}
              >
                Content
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="details" className="p-6 space-y-4">
            <DetailsTab file={file} />
          </TabsContent>

          {file.extractedText && (
            <TabsContent value="content" className="p-6">
              <ContentTab file={file} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
