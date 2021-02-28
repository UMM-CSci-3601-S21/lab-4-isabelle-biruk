package umm3601.todo;

import org.mongojack.Id;
import org.mongojack.ObjectId;

// @JsonDeserialize(as = Todo.class)
public class Todo {

  @ObjectId
  @Id
  public String _id;

  public String owner;
  public boolean status;
  public String body;
  public String category;
}