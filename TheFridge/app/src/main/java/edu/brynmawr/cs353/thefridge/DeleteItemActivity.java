package edu.brynmawr.cs353.thefridge;


import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class DeleteItemActivity extends AppCompatActivity {

    JSONArray in_the_fridge;
    String user;
    ArrayList<String> personal_item_ids = new ArrayList<>();
    Context context = this;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_delete);
        user = getIntent().getStringExtra("user");

        getItemsFromDatabase();
        UIItems();
    }

    public void UIItems(){
        ListView lv = (ListView) findViewById(R.id.listview);

        ArrayList<String> items = new ArrayList<String>();

        if (in_the_fridge == null)
        {
            items.add("There are no items in the fridge.");
        }else{
            for (int i = 0; i < in_the_fridge.length(); i++)
            {
                try {
                    JSONObject item = in_the_fridge.getJSONObject(i);
                    String info = "";
                    if (item.has("owner")){
                        if (item.getString("owner").equals(user)){
                            if (item.has("type"))
                            {
                                info +="Type: " + item.getString("type") + " ";
                            }
                            if (item.has("expDate"))
                            {
                                info +="Expiration Date: " + item.getString("expDate") +" ";
                            }
                            if (item.has("date Added"))
                            {
                                info +="Date Added: " + item.getString("date Added");
                            }
                            if (item.has("_id"))
                            {
                                personal_item_ids.add(item.getString("_id"));
                            }

                            items.add(info);
                        }

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        //https://developer.android.com/reference/android/widget/ArrayAdapter
        ArrayAdapter adapter = new ArrayAdapter(this,android.R.layout.simple_list_item_1, items);
        lv.setAdapter(adapter);
        lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> fridge, View view, int position, long id) {
                String item = (String) fridge.getItemAtPosition(position);

                //https://developer.android.com/reference/android/app/AlertDialog.Builder
                AlertDialog.Builder alert = new AlertDialog.Builder(context);
                alert.setTitle("Do you really want to delete");
                alert.setMessage(item);
                alert.setPositiveButton("Confirm", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String item = (String) fridge.getItemAtPosition(position);
                        items.remove(item);
                        adapter.notifyDataSetChanged();
                        try {
                            //update database
                            deleteItemFromDatabase(personal_item_ids.get(position));
                        } catch (MalformedURLException e) {
                            e.printStackTrace();
                        }
                    }
                });
                alert.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //do nothing
                    }
                });
                AlertDialog confirmation = alert.create();
                confirmation.show();
            }

        });
    }

    public void deleteItemFromDatabase(String id) throws MalformedURLException {
        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                        try {

                            URL url = new URL("http://10.0.2.2:3000/delete?id="+id);

                            //open the connection and send the url through
                            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                            conn.setRequestMethod("GET");
                            conn.connect();
                            url.openStream();


                            Log.v("message", "successfully deleted");

                        }
                        catch (Exception e) {
                            Log.v("error", e.toString());
                        }
                    }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            //tv.setText(e.toString());
        }
    }

    //connects to NodeExpress /api to get the items in the fridge
    public void getItemsFromDatabase() {

        try {
            Log.v("checking", "Getting items from database");
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                        try {
                            //want the /api endpoint
                            URL url = new URL("http://10.0.2.2:3000/api");

                            //open the connection and send the url through
                            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                            conn.setRequestMethod("GET");
                            conn.connect();

                            //read in returned JSON Array of items in the fridge
                            Scanner in = new Scanner(url.openStream());
                            String response = in.nextLine();
                            in_the_fridge = new JSONArray(response);

                            Log.v("items", in_the_fridge.toString());

                        }
                        catch (Exception e) {
                            Log.v("error", e.toString());
                        }
                    }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
        }
    }

    private class StableArrayAdapter extends ArrayAdapter<String> {

        HashMap<String, Integer> ids = new HashMap<String, Integer>();

        public StableArrayAdapter(Context context, int textViewResourceId, List<String> items) {
            super(context, textViewResourceId, items);
            for (int i = 0; i < items.size(); ++i) {
                ids.put(items.get(i), i);
            }
        }

        /*@Override
        public long getItemId(int position) {
            String item = getItem(position);
            return ids.get(item);
        }*/

    }

}