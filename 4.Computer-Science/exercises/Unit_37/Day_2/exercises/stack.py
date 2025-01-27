class Stack():
    def __init__(self, max_value=2):
        self._data = list()
        self._max_value = max_value

    def size(self):
        return len(self._data)

    def is_empty(self):
        return not bool(self.size())

    def push(self, value):
        if self.size() < self._max_value:
            self._data.append(value)
        else:
            raise Exception("Não é possível adicionar outro item à pilha")

    def pop(self):
        if self.is_empty():
            return None

        # -1 se refere ao último objeto da pilha,
        # ou seja, o valor do topo da pilha
        value = self._data[-1]
        del self._data[-1]
        return value

    def peek(self):
        if self.is_empty():
            return None

        value = self._data[-1]
        return value

    def clear(self):
        self._data.clear()

    def __str__(self):
        str_items = ""

        for i in range(self.size()):
            value = self._data[i]
            str_items += str(value)

            if i + 1 < self.size():
                str_items += ", "

        return "Stack(" + str_items + ")"

    def min_value(self):
        if self.is_empty():
            return None

        return min(self._data)


if __name__ == "__main__":
    elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    content_stack = Stack()

    for elem in elements:
        content_stack.push(elem)

    # saída: Stack(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    print(content_stack)
    # saída: 10
    print(content_stack.size())

    # saída: 10
    print(content_stack.peek())
    # saída: 10, pois a função retorna o elemento que está sendo retirado
    print(content_stack.pop())

    # saída: 9, pois, após o 10 ter sido removido, o 9 se tornou o elemento do topo da pilha
    print(content_stack.peek())
    # saída: 9
    print(content_stack.size())

    # saída: None, pois a função não retorna nada!
    print(content_stack.clear())
    # saída: 0
    print(content_stack.size())

    for elem in elements:
        content_stack.push(elem)

    print(content_stack)

    print(content_stack.min_value())
