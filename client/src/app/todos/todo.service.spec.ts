import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';


describe('TodoService', () => {
  const testTodos: Todo[] = [
    {
      owner: "Blanche",
      "_id":"58af3a600343927e48e8720f",
      status: false,
      body: "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
      category: "software design",
    },
    {
      owner: 'Fry',
      _id: "58af3a600343927e48e87210",
      status: false,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games',
    },
    {
      owner: "Fry",
      _id: "58af3a600343927e48e87211",
      status: true,
      body: "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
      category: "homework",
    }
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

  describe('when getTodos() is called with parameters, it correctly forms the http request', () => {
    // this is really just testing what the http request returns
    it('correctly calls api/todos with filter parameter \'owner\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos({ owner: "Blanche" }).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams().set('owner', 'Blanche') });
      });
    });
    it('correctly calls api/todos with filter parameter status = true', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos({ status: 'true' }).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams().set('status', 'true') });
      });
    })
    it('correctly calls api/todos with filter parameter status = false', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));

      todoService.getTodos({ status: 'false' }).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, { params: new HttpParams().set('status', 'false') });
      });
    })

    it('correctly calls api/todos with multiple filter parameters(status and owner)', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTodos));
      todoService.getTodos({owner: "Fry", status: 'false'}).subscribe(() => {
        const [url, options] = mockedMethod.calls.argsFor(0);
        const calledHttpParams: HttpParams = (options.params) as HttpParams;
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(url)
          .withContext('talks to the correct endpoints')
          .toEqual(todoService.todoUrl);
          console.log(todoService.todoUrl);
        expect(calledHttpParams.keys().length)
          .withContext('should have 2 params')
          .toEqual(2);
        expect(calledHttpParams.get('owner'))
          .withContext('owner is Fry')
          .toEqual('Fry');
        expect(calledHttpParams.get('status'))
          .withContext('status is false/incomplete')
          .toEqual('false');
      });
    });
  })

  describe('giving getTodoByID is called', () => {
    it('calls api/todos/id with the correct id', waitForAsync(() => {
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetTodo));

      todoService.getTodoById(targetId).subscribe((todo) => {
        expect(todo).withContext('return target todo').toBe(targetTodo);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to correct endpoint')
          .toHaveBeenCalledWith(`${todoService.todoUrl}/${targetId}`);
      });
    }));
  });
  /*
  describe('Filtering on the client using `filterUsers()` (Angular/Client filtering)', () => {
    //
    //  * Since `filterUsers` actually filters "locally" (in
    //  * Angular instead of on the server), we do want to
    //  * confirm that everything it returns has the desired
    //  * properties. Since this doesn't make a call to the server,
    //  * though, we don't have to use the mock HttpClient and
    //  * all those complications.
    //
    it('filters by name', () => {
      const userName = 'i';
      const filteredUsers = userService.filterUsers(testUsers, { name: userName });
      // There should be two users with an 'i' in their
      // name: Chris and Jamie.
      expect(filteredUsers.length).toBe(2);
      // Every returned user's name should contain an 'i'.
      filteredUsers.forEach(user => {
        expect(user.name.indexOf(userName)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by company', () => {
      const userCompany = 'UMM';
      const filteredUsers = userService.filterUsers(testUsers, { company: userCompany });
      // There should be just one user that has UMM as their company.
      expect(filteredUsers.length).toBe(1);
      // Every returned user's company should contain 'UMM'.
      filteredUsers.forEach(user => {
        expect(user.company.indexOf(userCompany)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by name and company', () => {
      // There's only one user (Chris) whose name
      // contains an 'i' and whose company contains
      // an 'M'. There are two whose name contains
      // an 'i' and two whose company contains an
      // an 'M', so this should test combined filtering.
      const userName = 'i';
      const userCompany = 'M';
      const filters = { name: userName, company: userCompany };
      const filteredUsers = userService.filterUsers(testUsers, filters);
      // There should be just one user with these properties.
      expect(filteredUsers.length).toBe(1);
      // Every returned user should have _both_ these properties.
      filteredUsers.forEach(user => {
        expect(user.name.indexOf(userName)).toBeGreaterThanOrEqual(0);
        expect(user.company.indexOf(userCompany)).toBeGreaterThanOrEqual(0);
      });
    });
  }); */
  describe('Adding a todo using `addTodo()`', () => {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      const todo_id = 'pat_id';
      const expected_http_response = { id: todo_id } ;

      const mockedMethod = spyOn(httpClient, 'post')
        .and
        .returnValue(of(expected_http_response));

      todoService.addTodo(testTodos[1]).subscribe((new_todo_id) => {
        expect(new_todo_id).toBe(todo_id);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(todoService.todoUrl, testTodos[1]);
      });
    }));
  })
});
