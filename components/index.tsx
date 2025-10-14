"use client";

import { useState } from "react";
import { streamData, Todo } from "../actions/fetchData";

export function MyClientComponent() {
  const [data, setData] = useState<Todo[]>([]);
  return (
    <div
      onClick={async () => {
        console.log("clicked");
        let chunk = await streamData(12);
        while (true) {
          if (!chunk.iteratorResult.done) {
            console.log(chunk.iteratorResult.value);
            setData((prev) => prev.concat(chunk.iteratorResult.value!)); // FIXME
          }
          if (!chunk.next) break;
          chunk = await chunk.next;
        }
      }}
    >
      client: {data.map((d) => d?.title || "").join("")}
    </div>
  );
}
