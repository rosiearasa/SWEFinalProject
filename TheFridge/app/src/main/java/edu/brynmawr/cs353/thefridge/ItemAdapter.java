package edu.brynmawr.cs353.thefridge;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;

import org.json.JSONArray;

public class ItemAdapter extends BaseAdapter {
    Context context;
    LayoutInflater inflter;
    JSONArray items;

    public ItemAdapter(Context applicationContext, JSONArray items) {
        this.context = context;
        inflter = (LayoutInflater.from(applicationContext));
        this.items = items;
    }

    @Override
    public int getCount(){
        return items.length();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {

        view = inflter.inflate(R.layout.activity_list_view, null);

        return view;

    }
}
