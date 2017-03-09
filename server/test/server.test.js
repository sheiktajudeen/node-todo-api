const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',() => {

  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .set('x-auth',users[0].tokens[0].token)
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('GET /todos',() => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id' ,() => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  })

  it('Should return a 404 when doc not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should not return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })

});

describe('DELETE /todos/:id' ,() => {
  it('Should delete todo doc', (done) => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todos[1]._id.toHexString()).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  })

  it('Should not delete todo doc', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end((err,res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todos[1]._id.toHexString()).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  })

  it('Should return a 404 when doc not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  it('Should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var textTodo = 'First Test todo update';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({text: textTodo, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(textTodo);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      }).end(done);
  });

  it('Should not update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var textTodo = 'First Test todo update';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({text: textTodo, completed: true})
      .expect(404)
      .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var textTodo = 'Second Test todo update';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: textTodo, completed: false})
      .set('x-auth',users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(textTodo);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      }).end(done);
  });
});

describe('GET /users/me',() => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create user data', (done) => {
    var email = 'example@example.com'
    var password = '123abc!';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('Should return validation errors if request invalid', (done) => {
    var email = 'example'
    var password = '123a';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  });

  it('Should not create user if email in use', (done) => {
    var email = 'sheik@example.com'
    var password = '123abc!';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it('Should login user return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res) => {
        if(err){
          done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[1]).toInclude({
            access:'auth',
            token:res.headers['x-auth']
          });
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
  it("Should reject invalid login", (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: '123123123'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res) => {
        if(err){
          done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout',(done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .end((err,res) => {
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
