function Person(name) {
    const res = new Book()
    return res
}
function Book() {

}
Book["language"] = "Book";
Book["jump"] = function () {
    console.log(`Book`)
}
//在constructor创建属性和方法
Person["language"] = "简体中文";
Person["jump"] = function () {
    console.log(`跳跃了`)
}

//在prototype创建属性和方法
Person.prototype["country"] = "中国";
Person.prototype["study"] = function () {
    console.log(`${this.name}学习了`)
}
// Person.prototype = null

let a = new Person('xx')
console.log(a)