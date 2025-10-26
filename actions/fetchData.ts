"use server"

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export async function fetchFirstData(): Promise<Todo> {
  const data = await fetchData()
  console.log(data)
  return data
}

export async function fetchData(id: string = "1"): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
  return await res.json()
}

export async function* genData(count: number) {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    yield fetchData(i.toString())
  }
}

export async function streamData(count: number = 10) {
  return stream(genData(count))
}

export type IteratorResponse<T, U> = {
  result: IteratorResult<T, U>
  next?: Promise<IteratorResponse<T, U>>
}

async function stream<T, U>(
  generator: AsyncGenerator<T, U>,
): Promise<IteratorResponse<T, U>> {
  const next = generator.next()
  return next.then((res) => {
    if (res.done) {
      return { result: res }
    } else {
      return { result: res, next: stream(generator) }
    }
  })
}
