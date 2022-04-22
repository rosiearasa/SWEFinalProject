package edu.brynmawr.cs353.thefridge;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ItemAdapter extends BaseAdapter {
    Context context;
    LayoutInflater inflater;
    JSONArray items;

    public ItemAdapter(Context applicationContext, JSONArray items) {
        this.context = context;
        inflater = (LayoutInflater.from(applicationContext));
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

        view = inflater.inflate(R.layout.activity_list_view, null);
        try {
            JSONObject current = items.getJSONObject(i);

            String type = current.getString("type");
            TextView typeView = view.findViewById(R.id.item_type);
            typeView.setText(type);

            TextView expView = view.findViewById(R.id.item_expDate);
            expView.setText("Expires " + current.getString("expDate"));

            TextView userView = view.findViewById(R.id.item_user);
            String user = current.getString("owner");
            if(current.getBoolean("anonymous")) {
                user = "Anonymous";
            } else if(user == "null") {
                user = "No one";
            }
            userView.setText(user);

            TextView noteView = view.findViewById(R.id.item_note);
            String note = current.getString("note");
            if(!current.getBoolean("publicNote")) {
                note = "--";
            }
            noteView.setText(note);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return view;

    }
}
