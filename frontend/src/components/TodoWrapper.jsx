import React, { useEffect, useState } from 'react'
import TodoForm from './TodoForm'
import Todo from './Todo'
import {v4} from 'uuid'

const TodoWrapper = () => {
    const [todos, setTodos] = useState([])

    const fetchAllTodos = async ()=>{
        const apibase = "http://localhost:3000/api/v1";
        const request = await fetch(`${apibase}/todos/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },})
        if (request.ok){
            const data = await request.json();
            setTodos([...data])
        }else{
            console.log(request)
        }
    }

    const postTodo = async (todo)=>{
        const apibase = "http://localhost:3000/api/v1";
        const request = await fetch(`${apibase}/todos/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify(todo)})
        if (request.ok){
            setTodos([...todos, {...todo}])
        }else{
            console.log(request)
        }
    }

    useEffect(()=>{
        fetchAllTodos()
    }, [])

    const addTodo = async (val)=>{
        postTodo(val)
    }
    const deleteTodo = (val, key)=>{
        let copyTodos = [...todos];
        copyTodos.pop(key);
        setTodos(copyTodos);
    }

  return (
    <div>
        <h1>Awesome Todo App</h1>
        <h2>Memorise your tasks easily</h2>
        <div id='TodoWrapper'>
        <TodoForm addTodo={addTodo} />
        <div id='mytodosList'>
            {
                todos.map((val, i)=>{
                    return (
                        <Todo index={i} text={val.task} key={v4()} deleteTodo={deleteTodo}/>
                    )
                })
            }
        </div>
        </div>
    </div>
  )
}

export default TodoWrapper
