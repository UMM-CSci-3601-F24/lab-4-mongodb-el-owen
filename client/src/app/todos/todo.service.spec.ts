import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  const testTodos: Todo[] = [
    {
      status: true,
      owner: 'Blanche',
      _id: 'Blanche_id',
      body: 'wowwowowo',
      category: 'groceries',
    },
    {
      status: true,
      owner: 'Fry',
      _id: 'Blanche_id',
      body: 'wowwowowo',
      category: 'groceries',
    },
    {
      status: true,
      owner: 'Blanche',
      _id: 'Blanche_id',
      body: 'wowwowowo',
      category: 'groceries',
    },
  ]
  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    todoService = new TodoService(httpClient);
  })

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('When getTodos() is called with no paramters', () => {
    it('calls api/todos', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos().subscribe((todos) => {
        expect(todos)
          .withContext('returns the test todos')
          .toBe(testTodos);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams() });
      });
    }));
  });

  // describe('When given quantity limitTodos() returns appropriate amount of todos', () => {
  //   it('inputs limit quantity', waitForAsync(() => {
  //     //const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

  //     const limit = 1;
  //     const filteredTodos = todoService.limitTodos(testTodos,limit);
  //     expect(filteredTodos.length).toBe(1);

  //   }));
  // });

  // describe('When given negative quantity limitTodos() returns error', () => {
  //   it('inputs limit quantity', waitForAsync(() => {
  //     //const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

  //     const limit = -1;
  //     const filteredTodos = todoService.limitTodos(testTodos,limit);
  //     expect(filteredTodos.length).toBe(0);

  //   }));
  // });
  // describe('when getTodos() is called with parameters, it correctly forms the http request', () => {
  //   o
  // })

})
