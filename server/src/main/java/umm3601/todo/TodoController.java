package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about Todos.
 */
public class TodoController {

  private static final String OWNER_KEY = "owner";
  private static final String STATUS_KEY = "status";
  private static final String BODY_KEY = "body";
  private static final String CATEGORY_KEY = "category";


  private final JacksonMongoCollection<Todo> todoCollection;

  /**
   * Construct a controller for Todos.
   *
   * @param database the database containing Todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(database, "todos", Todo.class);
  }

  /**
   * Get the single Todo specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodo(Context ctx) {
    String id = ctx.pathParam("id");
    Todo Todo;

    try {
      Todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested Todo id wasn't a legal Mongo Object ID.");
    }
    if (Todo == null) {
      throw new NotFoundResponse("The requested Todo was not found");
    } else {
      ctx.json(Todo);
    }
  }

  /**
   * Delete the Todo specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteTodo(Context ctx) {
    String id = ctx.pathParam("id");
    todoCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the Todos.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodos(Context ctx) {

    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(OWNER_KEY)) {
      filters.add(eq(OWNER_KEY, ctx.queryParam(OWNER_KEY)));
    }

    if (ctx.queryParamMap().containsKey(STATUS_KEY)) {
      filters.add(eq(STATUS_KEY, ctx.queryParam(STATUS_KEY)));
    }

    if (ctx.queryParamMap().containsKey(BODY_KEY)) {
      filters.add(eq(BODY_KEY, ctx.queryParam(BODY_KEY)));
    }

    if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
      filters.add(eq(CATEGORY_KEY, ctx.queryParam(CATEGORY_KEY)));
    }



    String sortBy = ctx.queryParam("sortby", "owner"); //Sort by sort query param, default is name
    String sortOrder = ctx.queryParam("sortorder", "asc");

    ctx.json(todoCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
      .into(new ArrayList<Todo>()));
  }

  /**
   * Get a JSON response with a list of all the Todos.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewTodo(Context ctx) {
    Todo newTodo = ctx.bodyValidator(Todo.class)
      .check(todo -> todo.owner != null && todo.owner.length() > 0) //Verify that the Todo has a owner that is not blank
      .check(todo -> todo.category != null && todo.category.length() > 0) // Verify that the Todo has a category is not blank
      .check(todo -> todo.status == false || todo.status == true) // Verify that the status is true or false
      .check(todo -> todo.body!= null && todo.body.length() > 0) // Verify that the Todo has a body that is not blank
      .get();


    todoCollection.insertOne(newTodo);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newTodo._id));
  }

  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  @SuppressWarnings("lgtm[java/weak-cryptographic-algorithm]")
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    StringBuilder result = new StringBuilder();
    for (byte b : hashInBytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }
}
