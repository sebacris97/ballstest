from collections import Counter

def solution(s):
    b_positions = [i for i, c in enumerate(s) if c == 'B']
    total = len(b_positions)

    if total <= 1:
        return 0

    min_moves = float('inf')
    required_span = 2 * total - 1
    length = len(s)

    for start in range(length - required_span + 1):
        target = [start + 2 * i for i in range(total)]

        # ¿Hay una 'B' fija fuera de nuestra lista que pisa esta posición?
        if any(s[i] == 'B' and i not in b_positions for i in target):
            continue

        # Comparar cuántas 'B' ya están en lugar correcto
        current = Counter(b_positions)
        target_c = Counter(target)

        # Intersección: cuántas ya están bien ubicadas
        already_ok = sum((current & target_c).values())

        moves_needed = total - already_ok
        min_moves = min(min_moves, moves_needed)

    return min_moves if min_moves != float('inf') else -1


print(solution("..B..B..BB..B.BB"))
print(solution("B.BB..B"))  # 1
print(solution("..BB..."))  # 1
print(solution("..B....B.BB"))#2
print(solution("BB.BBB"))   # -1 ya que no hay forma de ubicarlas bien
print(solution("B.B.B."))   # 0 (ya que están bien ubicadas)
