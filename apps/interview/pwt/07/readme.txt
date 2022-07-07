子类型 
- nominal type system 
- structural type system [TypeScipt adopts]

unknown vs any

unknown: 可以赋值任何类型给它

any: 不仅可以赋值任何类型给它，也可以把它赋值给任何类型。它可以绕过类型检查

unknown 是顶层类型 Object | null | undefined 

never 是没有值的类型，是底层类型 (你无法创建这个类型的值)
