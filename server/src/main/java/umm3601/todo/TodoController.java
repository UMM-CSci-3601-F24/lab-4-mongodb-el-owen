package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

//import java.nio.charset.StandardCharsets;
//import java.security.MessageDigest;
//import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
//import io.javalin.validation.Validator;
import umm3601.Controller;

public class TodoController implements Controller {

  // private static final String API_TODOS = "/api/todos";
  // private static final String API_TODO_BY_ID = "/api/todos/{id}";
  static final String OWNER_KEY = "owner";
  static final String STATUS_KEY = "status";
  static final String BODY_KEY = "body";
  static final String CATEGORY_KEY = "category";

  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<Todo> todoCollection;


  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(
        database,
        "todos",
        Todo.class,
        UuidRepresentation.STANDARD);
  }

  public void getTodo(Context ctx) { //gets singular
    String id = ctx.pathParam("id");
    Todo todo;

    try {
      todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested todo id wasn't a legal Mongo Object ID.");
    }
    if (todo == null) {
      throw new NotFoundResponse("The requested todo was not found");
    } else {
      ctx.json(todo);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getTodos(Context ctx) { //gets more than one todo
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    ArrayList<Todo> matchingTodos = todoCollection
        .find(combinedFilter)
        .sort(sortingOrder)
        .into(new ArrayList<>());

    ctx.json(matchingTodos);
    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with an empty list of filters

    if (ctx.queryParamMap().containsKey(OWNER_KEY)) {
      System.err.println(ctx.queryParamMap());
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(OWNER_KEY)), Pattern.CASE_INSENSITIVE);
      filters.add(regex(OWNER_KEY, pattern));
    }

    if (ctx.queryParamMap().containsKey(STATUS_KEY)) {
      System.err.println(ctx.queryParamMap());
      Boolean statusToString = ctx.queryParamAsClass(STATUS_KEY, Boolean.class)
      .get();
      filters.add(eq(STATUS_KEY, statusToString));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "name"); // what are we sorting by
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public void addNewTodo(Context ctx) {
    String body = ctx.body();
    Todo newTodo = ctx.bodyValidator(Todo.class)
        .check(todo -> todo.owner != null && todo.owner.length() > 0,
            "User must have a non-empty user name; body was " + body)
        .check(todo -> todo.body != null && todo.body.length() > 0,
            "Todos's body must be greater than zero; body was " + body)
        .check(todo -> todo.category != null && todo.category.length() > 0,
            "Todos's category must be greater than zero; body was " + body)
        .get();

    todoCollection.insertOne(newTodo);

    ctx.json(Map.of("id", newTodo._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void deleteTodo(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = todoCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }

  public void addRoutes(Javalin server) {
    // Get the specified user
    // server.get(API_TODO_BY_ID, this::getTodo);

    // // List users, filtered using query parameters
    // server.get(API_TODOS, this::getTodos);

    // server.get("/api/usersByCompany", this::getUsersGroupedByCompany);
    // Get users, possibly filtered, grouped by company

    // Delete the specified user
    // server.delete(API_TODO_BY_ID, this::deleteTodo);

    // Add new user with the user info being in the JSON body
    // server.post(API_TODOS, this::addNewTodo);
    // of the HTTP request
  }
}
