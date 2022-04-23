/*
    Author: Maya Johnson
    Date: 4/23/22
    Formats the list view for the items in the fridge
 */

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
    JSONArray items; //items in the fridge

    public ItemAdapter(Context applicationContext, JSONArray items) {
        this.context = context;
        inflater = (LayoutInflater.from(applicationContext));
        this.items = items;
    }

    @Override
    public int getCount(){
        if(items == null) {
            return 0;
        }
        return items.length();
    }

    //required to extend BaseAdapter
    @Override
    public Object getItem(int i) {
        return null;
    }
    //required to extend BaseAdapter
    @Override
    public long getItemId(int i) {
        return 0;
    }

    //formatting for each item in the array
    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        view = inflater.inflate(R.layout.activity_list_view, null);
        try {
            //get the current object
            JSONObject current = items.getJSONObject(i);

            //fill each field according to specification
            //item type
            String type = current.getString("type");
            TextView typeView = view.findViewById(R.id.item_type);
            typeView.setText(type);

            //expiration date
            TextView expView = view.findViewById(R.id.item_expDate);
            expView.setText("Expires " + current.getString("expDate"));

            //item user if not anonymous
            TextView userView = view.findViewById(R.id.item_user);
            String user = current.getString("owner");
            if(current.getBoolean("anonymous")) {
                user = "Anonymous";
            } else if(user == "null") {
                user = "No one";
            }
            userView.setText(user);

            //item's note if public
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
