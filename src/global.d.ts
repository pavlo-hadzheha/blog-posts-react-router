/// <reference types="vite/client" />

type TChildrenProps<
  Key extends string = 'children',
  Props = never,
  T = TIsNever<Props> extends true ? React.ReactNode : (props: Props) => React.ReactNode,
> = Partial<Record<Key, T>>

type TClassProps = { className?: import('clsx').ClassValue }
type TClassNamesProp<T extends string | number | symbol> = {
  classNames?: {
    [Key in T]?: import('clsx').ClassValue
  }
}

type TAsChildProps<DefaultElementProps> =
  | ({ asChild?: false } & DefaultElementProps)
  | { asChild: true; children: React.ReactNode }

type TOptional<T> = null | undefined | T
type TNullable<T> = null | T
type TIsNever<T> = [T] extends [never] ? true : false
type TIndexedObject<T> = Record<string, T>

type TSignal = { signal?: AbortSignal }
