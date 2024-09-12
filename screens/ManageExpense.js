import { StyleSheet, TextInput, View } from "react-native";
import React, { useLayoutEffect } from "react";
import IconButton from "../ui/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, editExpense, removeExpense } from "../store/expenseSlice";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../utils/http";

const ManageExpense = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const editedExpenseId = route.params?.expenseId;
  const expenses = useSelector((state) => state.expenses);
  const selectedExpense = expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  const isEditing = !!editedExpenseId; // !! operator turns truthy value to true and falsy value to false

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    dispatch(removeExpense(editedExpenseId));
    await deleteExpense(editedExpenseId);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    if (isEditing) {
      dispatch(editExpense(expenseData));
      await updateExpense(editedExpenseId, expenseData);
    } else {
      const id = await storeExpense(expenseData);
      dispatch(
        addExpense({
          ...expenseData,
          id: id,
        })
      );
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        submitButtonLabel={isEditing ? "Edit" : "Add"}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            size={36}
            color={GlobalStyles.colors.error500}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
};

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
