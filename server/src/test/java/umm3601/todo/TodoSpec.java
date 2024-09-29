package umm3601.todo;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TodoSpec {
  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Todo todo1;
  private Todo todo2;

  @BeforeEach
  void setupEach() {
    todo1 = new Todo();
    todo2 = new Todo();
  }

  @Test
  void todosWithEqualIdAreEqual() {
    todo1._id = FAKE_ID_STRING_1;
    todo2._id = FAKE_ID_STRING_1;

    assertTrue(todo1.equals(todo2));
  }

  @Test
  void todosWithDifferentIdAreNotEqual() {
    todo1._id = FAKE_ID_STRING_1;
    todo2._id = FAKE_ID_STRING_2;

    assertFalse(todo1.equals(todo2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    todo1._id = FAKE_ID_STRING_1;
    todo2._id = FAKE_ID_STRING_1;

    assertTrue(todo1.hashCode() == todo2.hashCode());
  }

  @Test
  void todosAreNotEqualToOtherKindsOfThings() {
    todo1._id = FAKE_ID_STRING_1;
    // a todo is not equal to its id even though id is used for checking equality
    assertFalse(todo1.equals(FAKE_ID_STRING_1));
  }
}

