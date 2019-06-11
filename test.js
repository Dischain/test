import numpy as np

def convert_multiple_binary_to_single(data, bynary_cols, single_col_name, initial_value=''):
    df = data.copy()
    df[single_col_name] = pd.Series(np.full(len(df.index), initial_value))
    
    bynary_cols_ids = [X_train.columns.get_loc(col) for col in superstructure_cols]
    
    for ir, row in df.iterrows():
        for col_id in bynary_cols_ids:
            if row.iloc[:, col_id] == 1 and df[single_col_name].iloc[ir] != initial_value:
                df[single_col_name].iloc[ir] = df[single_col_name].iloc[ir] + "_and_" + data[col_id]
            else:
                df[single_col_name].iloc[ir] = data[col_id]
