//定义log
var log = function () {
    console.log.apply(console,arguments)
}

var e = function (selector) {
    return document.querySelector(selector)
}

var es = function (selector) {
    return document.querySelectorAll(selector)
}

var bindEvent = function (element,eventName,callback) {
    return element.addEventListener(eventName,callback)
}

var addAll = function (element,className) {
    return element.classList.add(className)

}

var appendHTML = function (element,html) {
    element.insertAdjacentHTML('beforeend',html)
}

//TODO格式化
var createTodo = function (todoItem) {
    var t = {
      task:todoItem,
      isFinished:false
    }
    return t
}

//保存todo
var save = function (todos) {
    var todoList = JSON.stringify(todos)
	localStorage.setItem('todoSpa',todoList)
}

//创建todo对象
var todo_create = function () {
    var button = e('.button-class-add')
    //log(button)
    //给button添加事件

    bindEvent(button,'click',function(event){
        var todoItem = e('.class-input-new').value
        //log(todo)
        //创建todo对象,转成希望的格式
        var todo = createTodo(todoItem)
        //载入当前存储的todos
        var todos = loadtodo()
		//log('todos',todos)
        todos.push(todo)

        //储存todo
        save(todos)
    })

}
//载入当前依储存的todo
var loadtodo = function () {
    //todoList数组化
        if(window.localStorage.todoSpa != 'undefined'){
            var todoList = JSON.parse(window.localStorage.todoSpa || '[]')
        } else {
            var todoList = JSON.parse('[]')
            window.localStorage.todoSpa ='[]'
        }


    log('todoList',todoList)
    //选中展示区域
    return todoList
}



//切换页面效果

var showtodo = function () {
    var buttons = es('.button-class')

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i]
      bindEvent(button,'click',function(event){
        var target = event.target
        //如果是创建页面按钮，显示创建页面
        if(target.classList.contains('create')){
            //创建页面
            show('create')

            //切换路由
			location.hash = '#create'

        } else if(target.classList.contains('showlist')){
              //创建页面
              show('showlist')


			  //保存当前状态

              //切换路由
			  location.hash = '#showlist'
			  showResults()
			  //完成与否操作
				isdone()
              //删除操作
              removeChild()
          } else if(target.classList.contains('edittodo')){
              //创建页面
              show('edittodo')
              //切换路由
			  location.hash = '#edittodo'
          } else if(target.classList.contains('tododetail')){
              //创建页面
              show('tododetail')


              //切换路由
			  location.hash = '#tododetail'
			  showResults()
			  //完成与否操作
				isdone()
            removeChild()
          }
      })

    }


}

var show = function (page) {
    var a = '#' + page
    var buttons = es('.button-class-todo')
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i]
      //log('button',button)
      addAll(button,'hide')
      button.style.display = 'none'
    }

    var b = e(a)
    b.classList.remove('hide')
    b.style.display = 'flex'
    //输入框清零
    var input = e('.class-input-new')
    input.value = ''



}

var template = function (todo) {
    var finished = todo.isFinished
    var task = todo.task
    var t = `
      <div class = 'todo-cell ${finished} '>
        <button class='class-button done'>完成</button>
		${task}

		<button class='class-button delete'>删除</button>
      </div>
    `
    return t
}

var templateMore = function (todo) {
	var task = todo.task
	log('task',task)
	var t =`
	<div class = 'div-class-more'>
	<span style='margin-right:10px;border:1px solid blue;padding:10px;'>${task}</span>
	<span>详情描述</span>
	<textarea></textarea>

	</div>




	`
	   return t


}

//可拖动的div
var moveDiv = function () {
    var button = e('.div-class-more')
    button.addEventListener('mousedown',function(e){
        var leftX = e.pageX - parseInt(button.style.left)
        var leftY = e.pageY - parseInt(button.style.top)
        button.addEventListener('mouseover',function (){
            button.style.left = e.pageX - leftX + 'px'
            button.style.top =e.pageY - leftY +'px'
        })
    })

}




var removeChild = function () {
    var bs = es('.todo-cell')
    for (var i = 0; i < bs.length; i++) {
        var button = bs[i]
        bindEvent(button,'click',function(event){
            var target = event.target
            //log('target',target)

            if(target.classList.contains('delete')){
                var parent = target.closest('.todo-cell')
                log('parent',parent)
                //父节点自毁
                parent.remove()
                //更新数据库
                save()
            }

        })
    }





}

var insert = function (todos,hash) {

    var b = e(hash)
	log('---',b)
    b.innerHTML = ''
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i]
      var t = template(todo)
      appendHTML(b,t)
    }

}
var insertMore = function (todos,hash) {

    var b = e(hash)
	log('---',b)
    b.innerHTML = ''
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i]
      var t = templateMore(todo)
      appendHTML(b,t)
    }

}


var showResults = function () {

	var hash = (!window.location.hash)?'#search':window.location.hash
	log('**',hash)
    var a = loadtodo() || ''
	if(hash == '#showlist'){
		log('ififif')
    return insert(a,hash)
	} else if(hash == '#tododetail'){
		log('pppp')
		return insertMore(a,hash)
	}
}

var pushState = function () {
	var hash
	hash = (!window.location.hash)?'#search':window.location.hash
	window.location.hash = hash
	//log('aaa',hash)
	switch(hash) {
		case '#search':
		show('create');
		break;
		case '#create':
		show('create');
		break;
		case '#showlist':
		show('showlist');
		break;
		case '#edittodo':
		show('edittodo');
		break;
		case '#tododetail':
		show('tododetail');
		break;
	}


}




window.addEventListener('popstate',function(){
		pushState()
	})


var isdone = function () {
		var bs = es('.todo-cell')
		    //log(bs,'lllll')
		for(var i = 0;i<bs.length;i++){
		var button = bs[i]
		      //log('--',button)
		bindEvent(button,'click',function(event){
			var target =event.target
			if(target.classList.contains('done')){
					var parent = target.parentNode
					if(parent.classList.contains('Finished')){
						parent.classList.remove('Finished')
					} else {
						parent.classList.add('Finished')
					}
			}
			//log('target',target)


		})
		}
}



var main = function () {
	todo_create()
	showtodo()

}
main()
