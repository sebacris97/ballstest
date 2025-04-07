def solution(s):
    b_positions = [i for i, c in enumerate(s) if c == 'B']
    total = len(b_positions)

    if total <= 1:
        return 0

    required_span = 2 * total - 1
    length = len(s)

    min_moves = float('inf')

    for start in range(length - required_span + 1):
        target_positions = [start + 2 * i for i in range(total)]

        # Verificamos si alguna 'B' no deseada ya está en una posición objetivo
        if any(s[i] == 'B' and i not in b_positions for i in target_positions):
            continue

        # Contamos cuántas Bs están ya bien posicionadas
        already_ok = sum(1 for b in b_positions if b in target_positions)

        moves = total - already_ok
        min_moves = min(min_moves, moves)

    return min_moves if min_moves != float('inf') else -1



print(solution("..B..B..BB..B.BB")) #3
print(solution("B.BB..B"))  # 1
print(solution("..BB..."))  # 1
print(solution("..B....B.BB"))#2
print(solution("BB.BBB"))   # -1 ya que no hay forma de ubicarlas bien
print(solution("B.B.B."))   # 0 (ya que están bien ubicadas)
