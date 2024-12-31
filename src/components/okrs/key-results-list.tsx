"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface KeyResultsListProps {
  keyResults: any[]
  userMap: Map<string, string>
}

export function KeyResultsList({ keyResults, userMap }: KeyResultsListProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }

  return (
    <div className="space-y-4">
      {keyResults?.map((kr) => (
        <Collapsible
          key={kr.id}
          open={openItems.includes(kr.id)}
          onOpenChange={() => toggleItem(kr.id)}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>{kr.title}</CardTitle>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Responsable: {userMap.get(kr.owner_id)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Progreso: 45%
                  </span>
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CardContent>
              <Progress value={45} className="h-2" />
              <CollapsibleContent className="space-y-4">
                <div className="mt-4">
                  <h4 className="mb-2 font-medium">Descripción</h4>
                  <p className="text-sm text-muted-foreground">
                    {kr.description}
                  </p>
                </div>
                {kr.deliverables?.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Deliverables</h4>
                    <div className="space-y-2">
                      {kr.deliverables.map((deliverable: any) => (
                        <div
                          key={deliverable.id}
                          className="rounded-lg border p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{deliverable.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {deliverable.description}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {userMap.get(deliverable.accountable_id)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
} 