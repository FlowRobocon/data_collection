import random

def split_da_list(da_list, task_batch_size=20, group_batch_size=50, shuffle=True):
    if shuffle:
        da_list = random.sample(da_list, k=len(da_list))
    groups = [[]]
    for i in range(0, len(da_list), task_batch_size):
        batch = da_list[i:i+task_batch_size]
        if len(groups[-1]) >= group_batch_size:
            groups.append([])
        groups[-1].append(batch)
    return groups