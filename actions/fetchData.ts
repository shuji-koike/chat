"use server";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export async function fetchFirstData(): Promise<Todo> {
  const data = await fetchData();
  console.log(data);
  return data;
}

export async function fetchData(id: string = "1"): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return await res.json();
}

export async function* genData(count: number) {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield fetchData(i.toString());
  }
}

// クライアントから呼び出されるServer Action
export async function streamData(count: number = 10) {
  const generator = genData(count);
  return streamChunk(generator);
}

type StreamResponseChunk<T, U> = {
  iteratorResult: IteratorResult<T, U>;
  next?: Promise<StreamResponseChunk<T, U>>;
};

async function streamChunk<T, U>(
  generator: AsyncGenerator<T, U>
): Promise<StreamResponseChunk<T, U>> {
  const next = generator.next();
  return next.then((res) => {
    if (res.done) {
      return { iteratorResult: res };
    } else {
      // 再帰的に次のチャンクをPromiseとして定義
      return { iteratorResult: res, next: streamChunk(generator) };
    }
  });
}
